import { defineTest } from '../../../testHelpers';

defineTest(__dirname, 'transform', null, 'block', { parser: 'ts' });
defineTest(__dirname, 'transform', null, 'expression', { parser: 'ts' });
