import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ImageBackground, TextInput, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';

const initMatchData = {
  userId: null,
  tournament_name: '',
  date: '',
  time: '',

  match_no: '',
  match_category: '',
  age_category: '',
  game_point: 21,
  interval_point: 11,
  game_cap: 30,
  num_of_sets: 3,
  interval_time: 1,

  team1_name: '',
  team1_player1_name: '',
  team1_player2_name: '',
  team1_country: '',
  team1_club: '',

  team2_name: '',
  team2_player1_name: '',
  team2_player2_name: '',
  team2_country: '',
  team2_club: '',
  
  team_1_game_points_set_i: [0],
  team_2_game_points_set_i: [0],
  set_winner_i: [-1],
  winner: -1
}

export default function App() {

  const [isMatchStarted, setIsMatchStarted] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  let player = (['','']);
  const [lastScorePlayer, setLastScorePlayer] = useState(-1);

  const [isFliped,setIsFliped] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [ipAddressErr, setIpAddressErr] = useState(false);
  const [ws, setWs] = useState(null); // Maintain WebSocket connection state
  

  
  const [matchData, setMatchData] = useState(initMatchData);


  // Function to establish WebSocket connection
  useEffect(() => {
    if (isValidIpAddress(ipAddress)) {
      setIpAddressErr(false);
      const socket = new WebSocket(`ws://${ipAddress}:8080`);
      setWs(socket); // Store the WebSocket connection
  
      // Add event listeners for WebSocket connection
      socket.addEventListener('open', () => {
        console.log('WebSocket connection established.');
      });
  
      socket.addEventListener('close', () => {
        console.log('WebSocket connection closed.');
      });
  
      socket.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
        setIpAddressErr(true);
      });
  
      return () => {
        socket.close();
      };
    } else {
      setIpAddressErr(true);
    }
  }, [ipAddress]);
  

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'MATCH_STATUS') {
          setIsMatchStarted(data.isMatchOnGoing);
        }
        if (data.type === 'MATCH_UPDATE') {
            setMatchData(data.matchData); // Update match data state
        }
      };
  
      return () => {
        ws.close(); // Close WebSocket connection when component unmounts
      };
    }
  }, [ws]); // Add ws as dependency
  
  player[0] = matchData.match_category.charAt(1).toLowerCase() != 'd'
    ? matchData.team1_player1_name 
    : (matchData.team1_player1_name.split(' ')[0] + ' & ' + matchData.team1_player2_name.split(' ')[0]);

  player[1] = matchData.match_category.charAt(1).toLowerCase() != 'd'
    ? matchData.team2_player1_name 
    : (matchData.team2_player1_name.split(' ')[0] + ' & ' + matchData.team2_player2_name.split(' ')[0]);


  const onclickFlip = () => {
    setIsFliped(!isFliped);
  }
  
  const onclickUndo = () => {
    if (!ws) return; // Check if WebSocket connection exists
    
    const data = {
      type: 'SCORE_UPDATE_MOBILE',
      value: {
        team: lastScorePlayer,
        value: -1
      }
    };
  
    ws.send(JSON.stringify(data)); 
    setLastScorePlayer(-1);
  }
  const increaseScore = (team) => {
    if (!ws) return; // Check if WebSocket connection exists
    
    const data = {
      type: 'SCORE_UPDATE_MOBILE',
      value: {
        team: team,
        value: +1
      }
    };
  
    ws.send(JSON.stringify(data)); 
    setLastScorePlayer(team);
  };



  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleTextChange = (newText) => {
    setIpAddress(newText);
  };

  const handleAddIpBtn = () => {
    if (isValidIpAddress(ipAddress)) {
      setIpAddressErr(false);
    } else {
      setIpAddressErr(true);
    }
    closeModal();
  }

  function isValidIpAddress(ipAddress) {
    // Regular expression to match an IP address in the format xxx.xxx.xxx.xxx
    const ipPattern = /^(25|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
    if (ipAddress.match(ipPattern)) {
      return true; 
    } else {
      return false;
    }
  }

  return (
    <ImageBackground
      source={require('./assets/bg.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button1,{backgroundColor: `${isFliped?'#D21F1F':'#2A42BE'}`}]} onPress={() => increaseScore(isFliped?1:2)}>
            <Text style={styles.buttonText}>+1</Text>
          </TouchableOpacity>
          <View style={styles.centerBox} >

          <View >
            <TouchableOpacity 
              onPress={openModal}
            >
              <View style={styles.textBox1} >
                <Text style={{paddingLeft:10}} >
                  <Octicons name="dot-fill" size={20} color={ipAddressErr?'red':'green'} />
                </Text>
                <Text style={styles.ipText} >
                  {ipAddress != '' ?ipAddress :'Add IP'}
                </Text>
              </View>
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
                  <Button title="Add" onPress={handleAddIpBtn} />
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
          <TouchableOpacity style={[styles.button2,{backgroundColor: `${!isFliped?'#D21F1F':'#2A42BE'}`}]} onPress={() => increaseScore(!isFliped?1:2)}>
            <Text style={styles.buttonText}>+1</Text>
          </TouchableOpacity>
        </View>
      </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={!isMatchStarted}
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
    justifyContent: 'space-around',
    alignItems: 'center', 
    flexDirection: 'row', 

    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    width: 'auto',
    height: 25,
    borderColor: '#FFF',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 5,
    backgroundColor: 'rgba(63, 54, 54, 0.6)',
  },
  ipText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 15,
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
    paddingHorizontal: 10,
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
