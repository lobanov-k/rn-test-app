import * as Amplitude from 'expo-analytics-amplitude';
import analyticsSettings from '../configs/analytics-config';

Amplitude.initialize(analyticsSettings.apiKey);

export default Amplitude;