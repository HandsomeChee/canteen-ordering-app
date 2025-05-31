import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, ScrollView } from 'react-native';
import styles2 from '../styles/AccountStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HelpSupportScreen = ({navigation}:any) => {
  return (
    <ScrollView style={[styles2.container]}>
      <View style={styles2.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles2.header}>Help & Support</Text>
      </View>

      {/* FAQ Section */}
      <View style={[styles.sectionContainer, { padding:16}]}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <Text style={styles.faqText}>Q1: How do I top up my wallet?</Text>
        <Text style={styles.faqAnswer}>
          Ans: To top up your wallet, go to the 'Wallet' screen, enter the amount you wish to add, and confirm with your password.
        </Text>

        <Text style={styles.faqText}>Q2: What should I do if I forget my password?</Text>
        <Text style={styles.faqAnswer}>
          Ans: You can reset your password by going to the 'Forgot Password' section at the Login Page either by Email or Phone Number.
        </Text>

        <Text style={styles.faqText}>Q3: How do I view my transaction history?</Text>
        <Text style={styles.faqAnswer}>
          Ans: Currently, transaction history is not available. This feature will be added in future updates.
        </Text>
      </View>

      {/* Troubleshooting Section */}
      <View style={[styles.sectionContainer,{ padding:16}]}>
        <Text style={styles.sectionTitle}>Troubleshooting</Text>
        <Text style={[styles.issueText,{color:'black'},{fontWeight:'bold'}]}>• Issue: Unable to log in</Text>
        <Text style={styles.issueText}>• Solution: Make sure your credentials are correct or use the "Forgot Password" feature.</Text>

        <Text style={[styles.issueText,{color:'black'},{fontWeight:'bold'}]}>• Issue: Wallet not updated after top-up</Text>
        <Text style={styles.issueText}>• Solution: Please wait a few minutes for the transaction to reflect, or contact support if the issue persists.</Text>
      </View>

      {/* Contact Us Section */}
      <View style={[styles.sectionContainer,{ padding:16}]}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.contactText}>Any further questions? Feel free to contant us at:</Text>
        <Text style={styles.contactText}>📧 Email: xxxCanteen@example.com</Text>
        <Text style={styles.contactText}>📞 Phone: +6012-3456789</Text>
        <Text style={styles.contactText}>⏰ Hours: Mon - Fri, 9am - 5pm</Text>
      </View>

      {/* Submit a Request Section */}
      <View style={[styles.sectionContainer,{ padding:16}]}>
        <Text style={styles.sectionTitle}>Submit a Support Request</Text>
        <Text style={styles.contactText}>If your issue is not covered in the FAQs or Troubleshooting, please submit a request for further assistance:</Text>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => Linking.openURL('mailto:xxxCanteen@example.com')}
        >
          <Text style={styles.submitButtonText}>Submit a Request</Text>
        </TouchableOpacity>
      </View>

      {/* Live Chat Section (Optional) */}
      <View style={[styles.sectionContainer,{ padding:16}]}>
        <Text style={styles.sectionTitle}>Live Chat</Text>
        <Text style={styles.contactText}>You can chat with us instantly:</Text>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => Linking.openURL('https://wa.me/+60123456789')}
        >
          <Text style={styles.chatButtonText}>Chat with us on WhatsApp</Text>
        </TouchableOpacity>
      </View>

      {/* App Version & Troubleshooting Info */}
      <View style={[styles.sectionContainer,{ padding:16}]}>
        <Text style={styles.sectionTitle}>App Version & Troubleshooting</Text>
        <Text style={styles.appVersionText}>App Version: 1.0.0</Text>
        <Text style={styles.contactText}>Ensure your app is up to date by checking the latest version in the App Store/Play Store.</Text>
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 10,  
    left: 10,
  },
  sectionContainer: {
    borderRadius: 5,
    marginBottom: 20,
    shadowColor: 'blue',
    elevation: 5
  },
  sectionTitle: {
    alignSelf:'center',
    fontSize: 18,
    color:'black',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  faqText: {
    fontSize: 16,
    color:'black',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  faqAnswer: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  issueText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatButton: {
    backgroundColor: '#25D366',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
  },
  chatButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  appVersionText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
});

export default HelpSupportScreen;