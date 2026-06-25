import { useAudioPlayer } from 'expo-audio';

const useFeedback = () => {
  const player = useAudioPlayer(require('../assets/sounds/success.wav'));

  async function playSuccessSound() {
    try {
      if (player) {
        // Reset to beginning and play
        player.seekTo(0);
        player.play();
      }
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  }

  return { playSuccessSound };
};

export default useFeedback;
