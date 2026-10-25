import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Colors } from '../theme/colors';

interface AddDeviceModalProps {
  visible: boolean;
  onClose: () => void;
  onAddDevice: (name: string, room: string, watts?: number) => void;
}

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  visible,
  onClose,
  onAddDevice,
}) => {
  const [ssid, setSsid] = useState('globalnet');
  const [password, setPassword] = useState('K72316913');
  const [deviceName, setDeviceName] = useState('Sonoff POW Élite');
  const [room, setRoom] = useState('Livingroom');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberPass, setRememberPass] = useState(true);

  const handleSubmit = () => {
    if (!deviceName.trim()) return;
    onAddDevice(deviceName.trim(), room, 350);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.safeArea}>
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle}>Ajouter un appareil</Text>
          <View style={styles.navRight}>
            <Text style={styles.navRightIcon}>📶</Text>
            <Text style={styles.navRightIcon}>🔗</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollBody}>
          <Text style={styles.mainHeading}>
            Veuillez configurer l'appareil en mode appairage
          </Text>
          <Text style={styles.subText}>
            Choisissez un WiFi 2,4Ghz pour l'appairage de l'appareil et entrez le bon mot de passe.
            {'\n'}Si votre WiFi de 2.4Ghz et votre WiFi de 5Ghz partagent le même SSID WiFi, il est recommandé de changer les paramètres de votre routeur ou d'essayer un mode d'appairage compatible.
          </Text>

          {/* Wi-Fi Frequency Selector (1021.jpg) */}
          <View style={styles.freqRow}>
            <View style={styles.freqPillDisabled}>
              <Text style={styles.freqTextDisabled}>✕ WiFi–5GHz</Text>
            </View>
            <View style={styles.freqPillActive}>
              <Text style={styles.freqTextActive}>✓ WiFi–2.4GHz</Text>
              <Text style={styles.wifiMiniIcon}>📶</Text>
            </View>
          </View>

          <View style={styles.hintNotice}>
            <Text style={styles.hintNoticeText}>
              Prise en charge de l'ajout de périphériques WiFi et Bluetooth
            </Text>
            <Text style={styles.hintNoticeLink}>WiFi 2.4 Ghz seulement ›</Text>
          </View>

          {/* Input Fields */}
          <View style={styles.inputCard}>
            <View style={styles.inputRow}>
              <Text style={styles.inputPrefix}>📶</Text>
              <TextInput
                style={styles.textInput}
                value={ssid}
                onChangeText={setSsid}
                placeholder="Nom du réseau Wi-Fi"
                placeholderTextColor={Colors.textLight}
              />
              <Text style={styles.inputSuffix}>⇄</Text>
            </View>

            <View style={styles.inputDivider} />

            <View style={styles.inputRow}>
              <Text style={styles.inputPrefix}>🔒</Text>
              <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="Mot de passe"
                placeholderTextColor={Colors.textLight}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.eyeIcon}>{showPassword ? '👁' : '👁‍🗨'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember Password Checkbox */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setRememberPass(!rememberPass)}
          >
            <View style={[styles.checkboxBox, rememberPass && styles.checkboxActive]}>
              {rememberPass && <Text style={styles.checkGlyph}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Mémoriser le mot de passe</Text>
          </TouchableOpacity>

          {/* Device details */}
          <View style={styles.deviceConfigCard}>
            <Text style={styles.configLabel}>Nom de l'appareil</Text>
            <TextInput
              style={styles.configInput}
              value={deviceName}
              onChangeText={setDeviceName}
              placeholder="e.g. Sonoff POW Élite"
            />

            <Text style={[styles.configLabel, { marginTop: 12 }]}>Pièce assignée</Text>
            <View style={styles.roomSelectRow}>
              {['Livingroom', 'Bedroom', 'Kitchen', 'Other'].map(r => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roomPill, room === r && styles.roomPillActive]}
                  onPress={() => setRoom(r)}
                >
                  <Text style={[styles.roomPillText, room === r && styles.roomPillTextActive]}>
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Large Blue Submit Button */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Suivant</Text>
          </TouchableOpacity>

          {/* Footer Pairing Options */}
          <View style={styles.footerOptions}>
            <View style={styles.footerItem}>
              <View style={styles.footerCircle}><Text>📱</Text></View>
              <Text style={styles.footerLabel}>Appairage compatible</Text>
            </View>
            <View style={styles.footerItem}>
              <View style={styles.footerCircle}><Text>•••</Text></View>
              <Text style={styles.footerLabel}>Plus d'options</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  navBar: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: {
    padding: 6,
  },
  backArrow: {
    fontSize: 22,
    color: Colors.text,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  navRight: {
    flexDirection: 'row',
    gap: 8,
  },
  navRightIcon: {
    fontSize: 16,
  },
  scrollBody: {
    padding: 20,
    paddingBottom: 40,
  },
  mainHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    lineHeight: 26,
    marginBottom: 8,
  },
  subText: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
    marginBottom: 20,
  },
  freqRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  freqPillDisabled: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  freqTextDisabled: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ef4444',
  },
  freqPillActive: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bae6fd',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  freqTextActive: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  wifiMiniIcon: {
    fontSize: 12,
  },
  hintNotice: {
    marginBottom: 20,
  },
  hintNoticeText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  hintNoticeLink: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  inputCard: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  inputDivider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
  inputPrefix: {
    fontSize: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    padding: 0,
  },
  inputSuffix: {
    fontSize: 16,
    color: Colors.textLight,
  },
  eyeIcon: {
    fontSize: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  checkboxBox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: Colors.textLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkGlyph: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  checkboxLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  deviceConfigCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  configLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 6,
  },
  configInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
  },
  roomSelectRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  roomPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  roomPillActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  roomPillText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  roomPillTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: '#38bdf8',
    borderRadius: 28,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 32,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  footerOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  footerItem: {
    alignItems: 'center',
    gap: 6,
  },
  footerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});
