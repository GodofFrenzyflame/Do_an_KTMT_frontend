class HistoryData {
  constructor() {
    this.temperatureHistory = [];
    this.humidityHistory = [];
  }

  addTemperatureRecord(timestamp, temperature) {
    this.temperatureHistory.push({ timestamp, temperature });
  }

  addHumidityRecord(timestamp, humidity) {
    this.humidityHistory.push({ timestamp, humidity });
  }

  getTemperatureHistory() {
    return this.temperatureHistory;
  }

  getHumidityHistory() {
    return this.humidityHistory;
  }
}

const historyData = new HistoryData();
export default historyData;
