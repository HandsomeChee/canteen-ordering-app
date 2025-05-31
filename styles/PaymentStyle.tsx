import { StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    elevation: 3,
  },
  image: {
    width: 95,
    height: 85,
    borderRadius: 10,
    marginRight: 20,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: '#888',
  },
  quantity: {
    fontSize: 14,
    color: '#666',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 10,  
    left: 10,
    zIndex: 1,  
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color:'#333',
    marginTop: 20,
  },
  subHeader: {
    fontSize: 18,
    marginTop: 5,
    fontWeight: '500',
    marginBottom: 10,
  },
  totalContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    marginBottom: 5,
    borderColor: '#ddd',
    borderRadius: 12,
    elevation: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  pay: {
    backgroundColor: '#DC7726',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
});

export default styles;