import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { AuthContext } from '../../../contexts/AuthContext'
import { UserContext } from '../../../contexts/UserContext'

const MyProfileScreen = () => {
  const { userLogout } = useContext(AuthContext)
  const { currentUser } = useContext(UserContext)
  return (
    <View>
      <Text>Logged in as {currentUser.Name}. {currentUser.Email}</Text>
      <Button title="Logout" onPress={() => userLogout()}></Button>
    </View>
  )
}

export default MyProfileScreen

const styles = StyleSheet.create({})