import { StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color:'#333',
    marginTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIcon: {
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  image: {
    width: 95,
    height: 85,
    borderRadius: 10,
    marginRight: 20,
  },
  details: { 
    flex: 1 
  },
  name: { 
    fontSize: 16, 
    fontWeight: '600',
    color: '#333'
  },
  price: { 
    fontSize: 14, 
    color: '#888', 
    marginBottom: 6 
  },

  quantityRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  quantity: { 
    marginHorizontal: 10, 
    fontSize: 16,
  },
  totalContainer: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: 75, 
    borderTopWidth: 1,
    borderColor: '#ddd',
  },  
  totalText: { 
    fontSize: 18, 
    fontWeight: '600', 
    marginBottom: 10, 
    color: '#333'
  },
  
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },

  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { 
    fontSize: 16, 
    fontWeight: '600' },
});

export default styles;