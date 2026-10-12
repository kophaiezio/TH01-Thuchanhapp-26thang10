import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import {colors} from '../theme';

export function FormField({
  label,
  error,
  ...inputProps
}: TextInputProps & {label: string; error?: string}): React.JSX.Element {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...inputProps}
        placeholderTextColor={colors.muted}
        style={[styles.input, error ? styles.inputError : undefined]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {marginBottom: 18},
  label: {fontSize: 13, color: colors.text, fontWeight: '700', marginBottom: 8},
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: colors.text,
    fontSize: 15,
  },
  inputError: {borderColor: colors.red},
  error: {fontSize: 12, color: colors.red, marginTop: 6},
});
