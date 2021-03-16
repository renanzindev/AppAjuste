import { StyleSheet } from 'react-native';

export const LoginStyles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  bodyInner: {
    width: 340,
    height: 390,
    top: 70,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  bodyInnerBefore: {
    width: 380,
    minHeight: 260,
    top: -120,
    backgroundColor: '#8bc34a',
    zIndex: -1,
  },
  cardWhite: {
    padding: 20,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 2,
    backgroundColor: '#fff',
    color: '#3D4051',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  logoLogin: {
    marginTop: 30,
    marginBottom: 30,
    width: '75%',
    resizeMode: 'contain',
  },
  input: {
    width: '100%',
    color: '#c9c9c9',
    fontSize: 12,
    marginBottom: 0,
    paddingBottom: 0,
    textAlignVertical: 'bottom',
  },
  inputIcon: {
    color: '#c9c9c9',
    textAlignVertical: 'bottom',
    paddingBottom: 0,
  },
  inputContainer: {
    width: '80%',
    fontSize: 12,
    justifyContent: 'center',
  },
  inputContainer2: {
    borderBottomWidth: 0.8,
    borderColor: '#cbd5dc',
    textAlignVertical: 'bottom',
    paddingBottom: 0,
  },
  inputLeftIconContainer: {
    justifyContent: 'flex-end',
  },
  button: {
    height: 60,
    backgroundColor: '#007d71',
  },
  buttonContainer: {
    width: '75%',
  },
  buttonDisabled: {
    backgroundColor: '#5daaa2',
  },
  buttonDisabledTitle: {
    color: '#fff',
  },
});
