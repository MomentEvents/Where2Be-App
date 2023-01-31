import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Event } from '../../../constants'

type EventResultProps = {
  event: Event
}
const EventResult = (props: EventResultProps) => {
  return (
    <TouchableOpacity>
      <Text>EventResult</Text>
    </TouchableOpacity>
  )
}

export default EventResult

const styles = StyleSheet.create({})