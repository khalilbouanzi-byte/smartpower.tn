import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useSmartPower } from '../context/SmartPowerContext';
import { DeviceCard } from '../components/DeviceCard';
import { Colors } from '../theme/colors';
import { RoomType } from '../types';

export const DomicileScreen: React.FC = () => {
  const {
    devices,
    currentRoom,
    setCurrentRoom,
    toggleDevice,
    homeName,
    setHomeModalVisible,
    setAddDeviceModalVisible,
    setQrModalVisible,
  } = useSmartPower();

  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [googleBannerVisible, setGoogleBannerVisible] = useState(true);

  const rooms: { label: string; key: RoomType }[] = [
    { label: 'Tous', key: 'all' },
    { label: 'Livingro...', key: 'Livingroom' },
    { label: 'Bedroom', key: 'Bedroom' },
    { label: 'Other', key: 'Other' },
  ];

  const filteredDevices =
    currentRoom === 'all'
      ? devices
      : devices.filter(d => d.room.toLowerCase() === currentRoom.toLowerCase());

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header with ambient gradient */}
      <View style={styles.topHeader}>
        <View style={styles.titleRow}>
          <TouchableOpacity
            style={styles.homeSelector}
            onPress={() => setHomeModalVisible(true)}
          >
            <Text style={styles.homeName}>{homeName}</Text>
            <Text style={styles.dropdownChevron}>▼</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.circleAddBtn}
            onPress={() => setAddMenuOpen(!addMenuOpen)}
          >
            <Text style={styles.plusSign}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Add Device Popup Menu (1020.jpg) */}
        {addMenuOpen && (
          <View style={styles.popupMenu}>
            <TouchableOpacity
              style={styles.popupItem}
              onPress={() => {
                setAddMenuOpen(false);
                setAddDeviceModalVisible(true);
              }}
            >
              <Text style={styles.popupIcon}>➕</Text>
              <Text style={styles.popupText}>Ajouter un appareil</Text>
            </TouchableOpacity>

            <View style={styles.popupDivider} />

            <TouchableOpacity
              style={styles.popupItem}
              onPress={() => {
                setAddMenuOpen(false);
                setQrModalVisible(true);
              }}
            >
              <Text style={styles.popupIcon}>📷</Text>
              <Text style={styles.popupText}>Analyse</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Google Home banner */}
        {googleBannerVisible && (
          <View style={styles.googleBanner}>
            <View style={styles.bannerLeft}>
              <Text style={styles.googleIcon}>🏠</Text>
              <Text style={styles.bannerText}>Connecter Google Home</Text>
            </View>
            <TouchableOpacity onPress={() => setGoogleBannerVisible(false)}>
              <Text style={styles.bannerClose}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Room Navigation Tabs */}
        <View style={styles.roomTabsRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roomScroll}>
            {rooms.map(r => (
              <TouchableOpacity
                key={r.key}
                style={[styles.roomTab, currentRoom === r.key && styles.roomTabActive]}
                onPress={() => setCurrentRoom(r.key)}
              >
                <Text
                  style={[
                    styles.roomTabText,
                    currentRoom === r.key && styles.roomTabTextActive,
                  ]}
                >
                  {r.label}
                </Text>
                {currentRoom === r.key && <View style={styles.activeTabIndicator} />}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.roomActions}>
            <Text style={styles.actionIcon}>≡</Text>
            <Text style={styles.actionIcon}>•••</Text>
          </View>
        </View>
      </View>

      {/* Device List or Empty State */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredDevices.length === 0 ? (
          <View style={styles.emptyView}>
            <Text style={styles.emptyText}>Pas encore d'appareils.</Text>
            <TouchableOpacity
              style={styles.emptyAddBtn}
              onPress={() => setAddDeviceModalVisible(true)}
            >
              <Text style={styles.emptyAddBtnText}>Ajouter</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredDevices.map(device => (
            <DeviceCard key={device.id} device={device} onToggle={toggleDevice} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topHeader: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    position: 'relative',
    zIndex: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  homeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  homeName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  dropdownChevron: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  circleAddBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  plusSign: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: -2,
  },
  popupMenu: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: 190,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    zIndex: 100,
  },
  popupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  popupIcon: {
    fontSize: 16,
  },
  popupText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  popupDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  googleBanner: {
    backgroundColor: '#ffffff',
    borderRadius: 99,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    marginBottom: 12,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  googleIcon: {
    fontSize: 16,
  },
  bannerText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  bannerClose: {
    fontSize: 14,
    color: Colors.textLight,
  },
  roomTabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomScroll: {
    flex: 1,
  },
  roomTab: {
    paddingVertical: 8,
    marginRight: 22,
    position: 'relative',
  },
  roomTabActive: {},
  roomTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  roomTabTextActive: {
    color: Colors.text,
    fontWeight: '800',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  roomActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionIcon: {
    fontSize: 16,
    color: Colors.text,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 120,
    gap: 20,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textMuted,
  },
  emptyAddBtn: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 54,
    borderRadius: 6,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
  },
  emptyAddBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
