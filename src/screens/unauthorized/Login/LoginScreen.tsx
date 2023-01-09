import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { UserContext } from '../../../contexts/UserContext'
import { AuthContext } from '../../../contexts/AuthContext'

const LoginScreen = () => {
  const { userLogin } = useContext(AuthContext)
  return (
    <SafeAreaView>
      <Button title="Login" onPress={() => {userLogin("kyle1373", "password")}}></Button>
    </SafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})