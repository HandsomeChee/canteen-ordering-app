import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Tab bar styles
  tabBar: {
    height: 70,
    backgroundColor: '#DDC077',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    position: 'absolute',
    overflow: 'visible', 
  },
  // Icon styles
  iconWrapper: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusedIconWrapper: {
    backgroundColor: '#DC7726',
    borderWidth: 3,
    borderColor: '#fff',
    padding: 15,
    borderRadius: 30,
    marginTop: -30, 
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },

  // Toast styles
  toastSuccess: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
  },
  toastContent: {
    marginLeft: 10,
  },
  toastText1: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  toastText2: {
    color: 'white',
    fontSize: 14,
  },
});

export default styles;