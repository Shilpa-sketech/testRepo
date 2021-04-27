import { Alert } from 'react-native';


export default function aceAlert(message) {
  return Alert.alert('', message, [
    { text: 'OK' },
  ]);
}
