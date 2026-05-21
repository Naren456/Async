import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

const useFeedback = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  async function playSuccessSound() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/success.wav')
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return { playSuccessSound };
};

export default useFeedback;
