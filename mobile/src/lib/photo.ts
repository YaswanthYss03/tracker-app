// Take or choose a square photo and shrink it for upload (driver photos: max 70 KB).
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

export type PickedPhoto = { uri: string; base64: string };
const MAX_BYTES = 70 * 1024;

export async function pickPhoto(from: 'camera' | 'library'): Promise<PickedPhoto | 'denied' | null> {
  const perm = from === 'camera'
    ? await ImagePicker.requestCameraPermissionsAsync()
    : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return 'denied';

  const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 1 };
  const res = from === 'camera' ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
  if (res.canceled || !res.assets?.[0]) return null;

  // 320 px square JPEG; lower the quality until it fits.
  const ref = await ImageManipulator.manipulate(res.assets[0].uri).resize({ width: 320, height: 320 }).renderAsync();
  for (const compress of [0.75, 0.6, 0.45, 0.3]) {
    const out = await ref.saveAsync({ format: SaveFormat.JPEG, compress, base64: true });
    if (out.base64 && (out.base64.length * 3) / 4 <= MAX_BYTES) return { uri: out.uri, base64: out.base64 };
  }
  throw new Error('That photo is too large. Try another one.');
}
