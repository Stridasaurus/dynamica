import type { Meta, StoryObj } from '@storybook/react';
import { Heading, Body, Caption, Code } from './Typography';

const meta: Meta = { title: 'Typography' };
export default meta;

export const Headings: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Heading level={1}>Heading 1</Heading>
      <Heading level={2}>Heading 2</Heading>
      <Heading level={3}>Heading 3</Heading>
      <Heading level={4}>Heading 4</Heading>
    </div>
  ),
};

export const BodyText: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Body size="lg">Body large — the quick brown fox jumps over the lazy dog.</Body>
      <Body size="md">Body medium — the quick brown fox jumps over the lazy dog.</Body>
      <Body size="sm" color="secondary">Body small secondary — the quick brown fox jumps over the lazy dog.</Body>
    </div>
  ),
};

export const Captions: StoryObj = {
  render: () => <Caption>Last updated 2 minutes ago</Caption>,
};

export const InlineCode: StoryObj = {
  render: () => <Body>Use the <Code>useTheme()</Code> hook to read the current theme.</Body>,
};

export const CodeBlock: StoryObj = {
  render: () => <Code block>{'const { theme, toggleTheme } = useTheme();'}</Code>,
};
