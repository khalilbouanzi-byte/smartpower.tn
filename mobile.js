/**
 * Spower Mobile App JavaScript Engine
 * Faithfully connects all 15 screens & mockups from design_mockups
 */

// Initial seed devices based on screenshots
const INITIAL_MOBILE_DEVICES = [
  {
    id: "dev-76f3fc",
    name: "Device76f3fc",
    room: "Livingroom",
    statusText: "Hors-ligne",
    isOn: false,
    activeWatts: 120,
    type: "switch"
  },
  {
    id: "dev-pow-elite",
    name: "Sonoff POW Élite",
    room: "Livingroom",
    statusText: "En ligne",
    isOn: true,
    activeWatts: 1850,
    type: "breaker"
  },
  {
    id: "dev-s31-bed",
    name: "Prise Connectée S31",
    room: "Bedroom",
    statusText: "En ligne",
    isOn: true,
    activeWatts: 85,
    type: "plug"
  }
];

class SpowerMobileApp {
  constructor() {
    this.devices = this.loadDevices();
    this.currentRoom = "all";
    this.powerHistory = [];
    this.accumulatedKwh = 14.82;
    this.tariff = 0.16;

    this.cacheElements();
    this.bindEvents();
    this.renderDevices();
    this.updateApercuStats();
    this.startLiveSimulation();
  }

  loadDevices() {
    const saved = localStorage.getItem('spower_mobile_devices');
    return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(INITIAL_MOBILE_DEVICES));
  }

  saveDevices() {
    localStorage.setItem('spower_mobile_devices', JSON.stringify(this.devices));
  }

  cacheElements() {
    // Bottom Tab Bar
    this.tabButtons = document.querySelectorAll('.tab-button');
    this.screens = document.querySelectorAll('.mobile-screen');

    // Domicile (Home)
    this.deviceContainer = document.getElementById('deviceCardsContainer');
    this.emptyRoomView = document.getElementById('emptyRoomView');
    this.roomTabBtns = document.querySelectorAll('.room-tab-btn');
    this.openAddMenuBtn = document.getElementById('openAddMenuBtn');
    this.addDevicePopup = document.getElementById('addDevicePopup');
    this.ghomeBanner = document.getElementById('ghomeBanner');
    this.closeGhomeBtn = document.getElementById('closeGhomeBtn');
    this.openHomeModalBtn = document.getElementById('openHomeModalBtn');

    // Modals
    this.modalHomePicker = document.getElementById('modalHomePicker');
    this.backdropHomePicker = document.getElementById('backdropHomePicker');
    this.viewPairing = document.getElementById('viewPairing');
    this.closePairingBtn = document.getElementById('closePairingBtn');
    this.viewScanQr = document.getElementById('viewScanQr');
    this.closeScanQrBtn = document.getElementById('closeScanQrBtn');
    this.viewEnergyDashboard = document.getElementById('viewEnergyDashboard');
    this.closeEnergyBtn = document.getElementById('closeEnergyBtn');

    // Add Device Menu items
    this.popupAddDevice = document.getElementById('popupAddDevice');
    this.popupScanQr = document.getElementById('popupScanQr');
    this.emptyAddBtn = document.getElementById('emptyAddBtn');
    this.linkManualAdd = document.getElementById('linkManualAdd');

    // Pairing Form
    this.formAddDevice = document.getElementById('formAddDevice');
    this.inputDevName = document.getElementById('inputDevName');
    this.selectDevRoom = document.getElementById('selectDevRoom');
    this.btnToggleEye = document.getElementById('btnToggleEye');
    this.inputPass = document.getElementById('inputPass');

    // Aperçu
    this.openEnergyDashboardBtn = document.getElementById('openEnergyDashboardBtn');
    this.labelActiveDevicesCount = document.getElementById('labelActiveDevicesCount');

    // Energy Dashboard Live Values
    this.liveWattsDisplay = document.getElementById('liveWattsDisplay');
    this.liveVoltsDisplay = document.getElementById('liveVoltsDisplay');
    this.liveAmpsDisplay = document.getElementById('liveAmpsDisplay');
    this.todayKwhDisplay = document.getElementById('todayKwhDisplay');
    this.todayCostDisplay = document.getElementById('todayCostDisplay');
    this.mobileChartCanvas = document.getElementById('mobileChartCanvas');

    // Message Subtabs
    this.msgSubtabs = document.querySelectorAll('.msg-subtab');
    this.subviewTutoriel = document.getElementById('subviewTutoriel');
    this.subviewExplorer = document.getElementById('subviewExplorer');
    this.subviewNotif = document.getElementById('subviewNotif');
  }

  bindEvents() {
    // Bottom Tab Bar Navigation
    this.tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const targetScreenId = btn.getAttribute('data-screen');
        this.screens.forEach(s => s.classList.remove('active'));
        const targetScreen = document.getElementById(targetScreenId);
        if (targetScreen) targetScreen.classList.add('active');

        // Close any popups
        this.closeAllPopups();
      });
    });

    // Room Filter Tabs
    this.roomTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.roomTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentRoom = btn.getAttribute('data-room');
        this.renderDevices();
      });
    });

    // Dismiss Google Home banner
    if (this.closeGhomeBtn) {
      this.closeGhomeBtn.addEventListener('click', () => {
        this.ghomeBanner.style.display = 'none';
      });
    }

    // Toggle "+" Menu (1020.jpg)
    if (this.openAddMenuBtn) {
      this.openAddMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.addDevicePopup.classList.toggle('open');
      });
    }
    document.addEventListener('click', () => this.closeAllPopups());

    // Open Add Device Pairing View (1021.jpg)
    this.popupAddDevice.addEventListener('click', () => {
      this.closeAllPopups();
      this.openPairingView();
    });
    this.emptyAddBtn.addEventListener('click', () => this.openPairingView());
    this.closePairingBtn.addEventListener('click', () => this.closePairingView());

    // Open QR Scanner (1022.jpg)
    this.popupScanQr.addEventListener('click', () => {
      this.closeAllPopups();
      this.openQrScanner();
    });
    this.closeScanQrBtn.addEventListener('click', () => this.closeQrScanner());
    this.linkManualAdd.addEventListener('click', (e) => {
      e.preventDefault();
      this.closeQrScanner();
      this.openPairingView();
    });

    // House selector bottom sheet (1010.jpg)
    this.openHomeModalBtn.addEventListener('click', () => {
      this.modalHomePicker.classList.add('open');
    });
    this.backdropHomePicker.addEventListener('click', () => {
      this.modalHomePicker.classList.remove('open');
    });
    document.getElementById('chooseMyHome').addEventListener('click', () => {
      this.modalHomePicker.classList.remove('open');
    });

    // Pairing Form Submission
    this.formAddDevice.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = this.inputDevName.value.trim() || "Nouvel Appareil";
      const room = this.selectDevRoom.value || "Livingroom";

      const newDev = {
        id: `dev-${Math.random().toString(16).substring(2, 8)}`,
        name,
        room,
        statusText: "En ligne",
        isOn: true,
        activeWatts: 450,
        type: "switch"
      };

      this.devices.push(newDev);
      this.saveDevices();
      this.closePairingView();
      this.renderDevices();
      this.updateApercuStats();
    });

    // Eye toggle for password
    this.btnToggleEye.addEventListener('click', () => {
      this.inputPass.type = this.inputPass.type === 'password' ? 'text' : 'password';
    });

    // Open Energy Dashboard from Aperçu
    this.openEnergyDashboardBtn.addEventListener('click', () => {
      this.viewEnergyDashboard.classList.add('open');
      this.renderEnergyChart();
    });
    this.closeEnergyBtn.addEventListener('click', () => {
      this.viewEnergyDashboard.classList.remove('open');
    });

    // Message Subtabs (4000, 4010, 4020.jpg)
    this.msgSubtabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.msgSubtabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const sub = tab.getAttribute('data-sub');
        this.subviewTutoriel.style.display = sub === 'tutoriel' ? 'block' : 'none';
        this.subviewExplorer.style.display = sub === 'explorer' ? 'block' : 'none';
        this.subviewNotif.style.display = sub === 'notif' ? 'block' : 'none';
      });
    });

    // Build scene button in Scénario tab
    const buildSceneBtn = document.getElementById('buildSceneBtn');
    if (buildSceneBtn) {
      buildSceneBtn.addEventListener('click', () => {
        alert("Constructeur de Scénario : Automatisation créée pour couper le chauffage la nuit.");
      });
    }
  }

  closeAllPopups() {
    if (this.addDevicePopup) this.addDevicePopup.classList.remove('open');
  }

  openPairingView() {
    this.viewPairing.classList.add('open');
  }

  closePairingView() {
    this.viewPairing.classList.remove('open');
  }

  openQrScanner() {
    this.viewScanQr.classList.add('open');
  }

  closeQrScanner() {
    this.viewScanQr.classList.remove('open');
  }

  renderDevices() {
    const filtered = this.currentRoom === 'all'
      ? this.devices
      : this.devices.filter(d => d.room.toLowerCase() === this.currentRoom.toLowerCase());

    if (filtered.length === 0) {
      this.deviceContainer.style.display = 'none';
      this.emptyRoomView.style.display = 'flex';
    } else {
      this.emptyRoomView.style.display = 'none';
      this.deviceContainer.style.display = 'flex';

      this.deviceContainer.innerHTML = filtered.map(dev => {
        const isOn = dev.isOn;
        const statusClass = isOn ? 'is-on' : 'is-off';
        const statusLabel = isOn ? `${dev.activeWatts} W` : (dev.statusText || 'Hors-ligne');

        return `
          <div class="spower-device-card ${statusClass}" data-id="${dev.id}">
            <div class="card-left-section">
              <div class="device-badge-icon">
                ${this.getDeviceSvg(dev.type)}
              </div>
              <div class="card-info">
                <h4>${this.escape(dev.name)}</h4>
                <div class="card-status-sub">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  <span>${statusLabel}</span>
                </div>
              </div>
            </div>

            <div class="card-wifi-corner">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><line x1="12" y1="20" x2="12.01" y2="20" stroke-width="3"/></svg>
            </div>

            <label class="ios-switch">
              <input type="checkbox" class="device-power-toggle" ${isOn ? 'checked' : ''}>
              <span class="ios-slider"></span>
            </label>
          </div>
        `;
      }).join('');

      // Bind toggle listeners
      this.deviceContainer.querySelectorAll('.spower-device-card').forEach(card => {
        const id = card.getAttribute('data-id');
        const dev = this.devices.find(d => d.id === id);
        const toggle = card.querySelector('.device-power-toggle');

        toggle.addEventListener('change', (e) => {
          dev.isOn = e.target.checked;
          if (dev.isOn) {
            dev.statusText = "En ligne";
          }
          this.saveDevices();
          this.renderDevices();
          this.updateApercuStats();
        });
      });
    }
  }

  updateApercuStats() {
    const activeDevs = this.devices.filter(d => d.isOn);
    const count = activeDevs.length;
    const totalWatts = activeDevs.reduce((sum, d) => sum + (d.activeWatts || 0), 0);

    if (count === 0) {
      this.labelActiveDevicesCount.textContent = "Tous les appareils sont éteints.";
    } else {
      this.labelActiveDevicesCount.textContent = `${count} appareil${count > 1 ? 's' : ''} allumé${count > 1 ? 's' : ''} (${totalWatts.toLocaleString()} W)`;
    }
  }

  startLiveSimulation() {
    setInterval(() => {
      const activeDevs = this.devices.filter(d => d.isOn);
      let currentWatts = activeDevs.reduce((sum, d) => sum + (d.activeWatts || 0), 0);

      // Add small fluctuation
      if (currentWatts > 0) {
        currentWatts += Math.round((Math.random() - 0.5) * 20);
      }

      this.accumulatedKwh += (currentWatts / (3600 * 1000));
      this.powerHistory.push(currentWatts);
      if (this.powerHistory.length > 60) this.powerHistory.shift();

      // Update Energy Dashboard modal if open
      if (this.liveWattsDisplay) {
        this.liveWattsDisplay.textContent = currentWatts.toLocaleString();
        const volts = (230.1 + (Math.random() - 0.5) * 0.4).toFixed(1);
        const amps = (currentWatts / (parseFloat(volts) * 0.98)).toFixed(1);

        this.liveVoltsDisplay.textContent = `${volts} V`;
        this.liveAmpsDisplay.textContent = `${amps} A`;
        this.todayKwhDisplay.textContent = `${this.accumulatedKwh.toFixed(2)} kWh`;
        this.todayCostDisplay.textContent = `${(this.accumulatedKwh * this.tariff).toFixed(2)} €`;

        if (this.viewEnergyDashboard.classList.contains('open')) {
          this.renderEnergyChart();
        }
      }
    }, 1000);
  }

  renderEnergyChart() {
    if (!this.mobileChartCanvas) return;
    const ctx = this.mobileChartCanvas.getContext('2d');
    const w = this.mobileChartCanvas.width;
    const h = this.mobileChartCanvas.height;

    ctx.clearRect(0, 0, w, h);

    if (this.powerHistory.length < 2) return;
    const max = Math.max(1000, ...this.powerHistory * 1.2);
    const step = w / (this.powerHistory.length - 1);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) {
      const y = h - (h * (i / 3));
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Line & fill
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(2, 132, 199, 0.3)');
    grad.addColorStop(1, 'rgba(2, 132, 199, 0.0)');

    ctx.beginPath();
    ctx.moveTo(0, h);
    this.powerHistory.forEach((val, idx) => {
      const x = idx * step;
      const y = h - ((val / max) * (h - 20)) - 10;
      ctx.lineTo(x, y);
    });
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Stroke
    ctx.beginPath();
    this.powerHistory.forEach((val, idx) => {
      const x = idx * step;
      const y = h - ((val / max) * (h - 20)) - 10;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  getDeviceSvg(type) {
    switch (type) {
      case 'breaker':
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
      case 'plug':
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v6m0 0a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-3-2v4m6-4v4"/></svg>`;
      default:
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9 12h6"/></svg>`;
    }
  }

  escape(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.spowerMobileApp = new SpowerMobileApp();
});
