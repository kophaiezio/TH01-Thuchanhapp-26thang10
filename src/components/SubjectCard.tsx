import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {Subject} from '../types';
import {colors} from '../theme';
import {Card} from './common';

export function SubjectCard({
  subject,
  onPress,
}: {
  subject: Subject;
  onPress: () => void;
}): React.JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Chi tiết môn ${subject.name}`}
      onPress={onPress}>
      <Card style={styles.card}>
        <View style={[styles.codeTile, {backgroundColor: `${subject.color}18`}]}>
          <Text style={[styles.code, {color: subject.color}]}>
            {subject.code}
          </Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>{subject.name}</Text>
          <Text style={styles.meta}>
            {subject.credits} tín chỉ
          </Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  codeTile: {
    width: 52,
    height: 52,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  code: {fontSize: 11, fontWeight: '800'},
  details: {flex: 1},
  name: {fontSize: 14, color: colors.text, fontWeight: '700'},
  meta: {fontSize: 11, color: colors.muted, marginTop: 5},
  arrow: {fontSize: 24, color: colors.muted, marginLeft: 8},
});
