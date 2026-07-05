import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { lightTheme, spacing, typography } from '../config/theme';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught render error', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      // Uses the light theme directly rather than useTheme() - a crashed render
      // tree can't be trusted to still have working context providers above it.
      return (
        <View style={[styles.container, { backgroundColor: lightTheme.background }]}>
          <Text style={styles.icon}>⚠️</Text>
          <Text style={[typography.h2, { color: lightTheme.text, textAlign: 'center' }]}>
            Something went wrong
          </Text>
          <Text
            style={[
              typography.body,
              { color: lightTheme.textMuted, textAlign: 'center', marginTop: spacing.sm },
            ]}
          >
            The app hit an unexpected error. Your progress is saved - try again.
          </Text>
          <Button label="Try again" onPress={this.reset} style={{ marginTop: spacing.xl }} />
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  icon: { fontSize: 48, marginBottom: spacing.md },
});
