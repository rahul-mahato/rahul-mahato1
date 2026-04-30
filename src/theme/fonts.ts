import {
  useFonts as useFraunces,
  Fraunces_300Light,
  Fraunces_400Regular,
  Fraunces_400Regular_Italic,
} from '@expo-google-fonts/fraunces';
import { Geist_300Light, Geist_400Regular, Geist_500Medium } from '@expo-google-fonts/geist';
import { GeistMono_400Regular } from '@expo-google-fonts/geist-mono';

/**
 * Load the three font families used by the design system. Returns a boolean
 * the root layout uses to gate splash-screen hide.
 */
export function useAppFonts(): boolean {
  const [loaded] = useFraunces({
    Fraunces_300Light,
    Fraunces_400Regular,
    Fraunces_400Regular_Italic,
    Geist_300Light,
    Geist_400Regular,
    Geist_500Medium,
    GeistMono_400Regular,
  });
  return loaded;
}
