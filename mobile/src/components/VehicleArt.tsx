// Vehicle picture: a 3D render when we have a model for the type (Kenney Car
// Kit), otherwise the colourful drawing. Same artwork as the map markers.
import { Image, View, type StyleProp, type ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { vehicleSvg } from '@/lib/vehicleArt';
import { VEHICLE_IMAGES } from '@/lib/vehicleSprites';
import { useColors } from '@/theme';

export function VehicleArt({ type, size = 40, dimmed, style }: { type: string | null | undefined; size?: number; dimmed?: boolean; style?: StyleProp<ViewStyle> }) {
  const c = useColors();
  const image = type ? VEHICLE_IMAGES[type] : undefined;
  const xml = image ? null : vehicleSvg(type);
  return (
    <View style={[{ width: size, height: size, opacity: dimmed ? 0.45 : 1, alignItems: 'center', justifyContent: 'center' }, style]}>
      {image ? (
        <Image source={image} style={{ width: size * 1.08, height: size * 1.08 }} resizeMode="contain" />
      ) : xml ? <SvgXml xml={xml} width={size} height={size} /> : <MaterialCommunityIcons name="navigation-variant" size={size * 0.7} color={c.text} />}
    </View>
  );
}

/** Round badge with the vehicle drawing, used in lists and cards. */
export function VehicleBadge({ type, online, size = 52 }: { type: string | null | undefined; online: boolean; size?: number }) {
  const c = useColors();
  return (
    <View
      style={{
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: '#FFFFFF',
        borderWidth: 2.5, borderColor: online ? c.accent : c.offline,
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      <VehicleArt type={type} size={size * 0.78} dimmed={!online} />
    </View>
  );
}
