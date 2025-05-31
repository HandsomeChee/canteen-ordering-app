import { StyleSheet } from "react-native";

const styles=StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#DDC077',
        justifyContent: 'center',
        alignItems: 'center',
      },
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      },
      input: {
        width: 300,
        fontSize: 20,
        height: 48,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: 'white',
        marginVertical: 10,
      },
      label: {
        width: 300,
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
      },
      button: {
        backgroundColor: '#DC7726',
        marginTop: 10,
        paddingHorizontal: 20,
        padding: 10,
        borderRadius: 12,
      },
      buttonText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
      },
      ButtonText: {
        fontSize: 13,
        textDecorationLine: 'underline',
        color: 'black',
        paddingRight:190,
        marginVertical: 10,
      },
      passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 300,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#ccc',
        backgroundColor: 'white',
        paddingRight: 10,
      },
      passwordInput: {
        flex: 1,
        fontSize: 20,
        height: 48,
        paddingHorizontal: 10,
      },
})

export default styles;