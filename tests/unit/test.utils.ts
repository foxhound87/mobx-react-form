import { expect } from 'chai';
import { hasUnifiedProps, hasSeparatedProps } from '../../src/utils'

describe('utils', () => {
	it('Issue #598, hasUnifiedProps()', () => {
		const fields: Array<{name: string, label?: string}> = [
			{
				name: 'field1'
			},
			{
				name: 'field2',
				label: 'label 2'
			}
		]
		expect(hasUnifiedProps({fields})).to.be.true
	})
})