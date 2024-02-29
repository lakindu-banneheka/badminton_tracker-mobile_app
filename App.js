import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ImageBackground, TextInput, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import * as WebSocket from 'ws';

export default function App() {

  const [isMatchStarted, setIsMatchStarted] = useState(true);
  const [ipAddress, setIpAddress] = useState('');
  const [player, setPlayer] = useState(['Geenath Pasindu','lakindu banneheka']);
  const [lastScorePlayer, setLastScorePlayer] = useState(-1);

  const [isFliped,setIsFliped] = useState(false);

  const onclickFlip = () => {
    setIsFliped(!isFliped);
  }
  
  const onclickUndo = () => {
    // decriment the score of player_id
    console.log('-1 from player ',lastScorePlayer)
    setLastScorePlayer(-1);

  }
  const increaseScore = (player) => {
    // incriment the score of player_id
    console.log('add +1 to player ', player)
    setLastScorePlayer(player)
  };


  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleTextChange = (newText) => {
    setIpAddress(newText);
    // You can perform additional logic here if needed
  };

  return (
    <ImageBackground
      source={require('./assets/bg.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button1,{backgroundColor: `${isFliped?'red':'blue'}`}]} onPress={() => increaseScore(isFliped?0:1)}>
            <Text style={styles.buttonText}>+1</Text>
          </TouchableOpacity>
          <View style={styles.centerBox} >

          <View >
            <TouchableOpacity 
              onPress={openModal}
            >
              <Text style={styles.textBox1}>{ipAddress != '' ?ipAddress :'Add IP'}</Text>
            </TouchableOpacity>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={closeModal}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text>Operator PC's IP Address</Text>
                  <TextInput
                    style={[styles.textBox1, {textAlign: 'center'}]}
                    onChangeText={handleTextChange}
                    value={ipAddress}
                    placeholder="Enter IP Address"
                    keyboardType="numeric"
                  />
                  <Button title="Add" onPress={closeModal} />
                </View>
              </View>
            </Modal>
          </View>

            <TextInput
              style={[styles.player1Text,{borderColor: `${isFliped?'#D21F1F':'#2A42BE'}`,}]}
              value={player[isFliped?1:0]}
              editable={false}
            />
            
            <Text style={{
                color: 'white',
                fontSize: 35,
                fontWeight: 'bold',
              }} >VS.</Text>

            <TextInput
              style={[styles.player2Text,{borderColor: `${!isFliped?'#D21F1F':'#2A42BE'}`,}]}
              value={player[isFliped?0:1]}
              editable={false}
            />
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}} >
              <TouchableOpacity style={styles.iconButton} onPress={onclickFlip} >
                <MaterialCommunityIcons name="swap-horizontal" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconButton} onPress={onclickUndo} >
                <MaterialCommunityIcons name="undo-variant" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
          </View>
          <TouchableOpacity style={[styles.button2,{backgroundColor: `${!isFliped?'red':'blue'}`}]} onPress={() => increaseScore(!isFliped?0:1)}>
            <Text style={styles.buttonText}>+1</Text>
          </TouchableOpacity>
        </View>
      </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isMatchStarted}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, {transform: [{ rotate: '90deg' }], justifyContent: 'space-around' }]}>
              <Text style={{fontSize: 16, fontWeight: '500'}} >
                Match is Paused or Not-Started yet.
              </Text>
              <TouchableOpacity 
                onPress={openModal}
              >
                <Text style={[styles.textBox1, {alignItems: 'center'}]}>{ipAddress != '' ?ipAddress :'Add IP'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    marginVertical: 30
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 150
  },
  button1: {
    width: '40%', 
    height: '40%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '-15%',
    transform: [{ rotate: '90deg' }],
  },
  button2: {
    width: '40%', 
    height: '40%',
    marginBottom: '5%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '90deg' }],
  },
  iconButton: {
    backgroundColor: 'rgba(63, 54, 54, 0.9)',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 55,
    fontWeight: 'bold',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',

    width: '100%',
    height: '100%'
  },
  background: {
    flex: 1,
    resizeMode: 'center', 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  textBox1: {
    display: 'flex', 
    justifyContent: 'center',
    alignItems: 'center', 

    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    width: 'auto',
    height: 25,
    borderColor: '#FFF',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(63, 54, 54, 0.6)',
  },

  player1Text: {
    color: 'white',
    width: 'auto',

    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    height: 35,
    width: 300,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(63, 54, 54, 0.6)',
    textAlign: 'center'
  },
  player2Text: {
    width: 'auto',

    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    width: 300,
    height: 35,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(63, 54, 54, 0.6)',
    textAlign: 'center'
  },
  centerBox : {
    // width: '100%',
    height: '40%',
    transform: [{ rotate: '90deg' }] , 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'space-between',
    alignItems: 'center', 
  }
});
