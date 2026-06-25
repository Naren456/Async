import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetAssignmentsByCohort, GetUserSubjectsWithNotes } from '../api/apiCall';

export class DataManager {
    // Lock gatekeeper flag to prevent concurrent duplicate initialization bursts
    private static isFetching = false;

    static KEYS = {
        ASSIGNMENTS: (cohort: string) => `cached_assignments_${cohort}`,
        SUBJECTS: (userId: string) => `cached_subjects_${userId}`,
    };

    /**
     * Get cached assignments for a cohort.
     * Returns null if no cache exists.
     */
    static async getAssignments(cohortNo: string) {
        try {
            const cached = await AsyncStorage.getItem(this.KEYS.ASSIGNMENTS(cohortNo));
            return cached ? JSON.parse(cached) : null;
        } catch (error) {
            console.error('DataManager: Error reading assignments cache:', error);
            return null;
        }
    }

    /**
     * Fetch assignments from API and update cache.
     * Returns the fresh data.
     */
    static async syncAssignments(cohortNo: string) {
        try {
            const data = await GetAssignmentsByCohort(cohortNo);
            if (data && data.grouped) {
                await AsyncStorage.setItem(this.KEYS.ASSIGNMENTS(cohortNo), JSON.stringify(data.grouped));
                return data.grouped;
            }
            return null;
        } catch (error) {
            console.error('DataManager: Error syncing assignments:', error);
            throw error;
        }
    }

    /**
     * Update the completion status of a single assignment in the cache.
     */
    static async updateAssignmentCompletion(cohortNo: string, assignmentId: string, completed: boolean) {
        try {
            const cached = await this.getAssignments(cohortNo);
            if (cached) {
                let updated = false;
                for (const date in cached) {
                    cached[date] = cached[date].map((item: any) => {
                        if (item.id === assignmentId) {
                            updated = true;
                            return { ...item, Completed: completed };
                        }
                        return item;
                    });
                }
                if (updated) {
                    await AsyncStorage.setItem(this.KEYS.ASSIGNMENTS(cohortNo), JSON.stringify(cached));
                }
            }
        } catch (err) {
            console.error('DataManager: Error updating assignment cache:', err);
        }
    }

    /**
     * Get cached subjects for a user.
     */
    static async getSubjects(userId: string) {
        try {
            const cached = await AsyncStorage.getItem(this.KEYS.SUBJECTS(userId));
            return cached ? JSON.parse(cached) : null;
        } catch (error) {
            console.error('DataManager: Error reading subjects cache:', error);
            return null;
        }
    }

    /**
     * Fetch subjects from API and update cache.
     */
    static async syncSubjects(userId: string) {
        try {
            const data = await GetUserSubjectsWithNotes(userId);
            if (data) {
                await AsyncStorage.setItem(this.KEYS.SUBJECTS(userId), JSON.stringify(data));
                return data;
            }
            return null;
        } catch (error) {
            console.error('DataManager: Error syncing subjects:', error);
            throw error;
        }
    }

    /**
     * Pre-fetches all critical user data (Assignments, Subjects).
     * Used during login/splash. Optimized to eliminate duplicate simultaneous processing.
     */
    static async prefetchUserData(user: any) {
        if (!user) return;
        
        // Return immediately if another prefetch handler is already executing
        if (this.isFetching) {
            return;
        }

        // Set flag lock to intercept concurrent double-mount rendering execution triggers
        this.isFetching = true;
        console.log('DataManager: Starting pre-fetch for user', user.name || user.email);

        const promises = [];

        // 1. Assignments
        if (user.cohortNo) {
            promises.push(
                this.syncAssignments(user.cohortNo)
                    .then(() => console.log('DataManager: Assignments pre-fetched.'))
                    .catch(err => console.error('DataManager: Failed to pre-fetch assignments:', err))
            );
        }

        // 2. Subjects
        const userId = user.id || user._id;
        if (userId) {
            promises.push(
                this.syncSubjects(userId)
                    .then(() => console.log('DataManager: Subjects pre-fetched.'))
                    .catch(err => console.error('DataManager: Failed to pre-fetch subjects:', err))
            );
        }

        try {
            await Promise.allSettled(promises);
        } finally {
            // Unlock the sequence once all pending promises have fully completed
            this.isFetching = false;
        }
    }
}