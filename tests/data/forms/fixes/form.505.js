import { Form } from '../../../../src';
import { expect } from 'chai';

const fields = [
	'club',
	'club.name',
	'club.city'
];

const labels = {
	'club': 'Club',
	'club.name': 'Name',
	'club.city': 'City'
}

const values = {
	club: {
		name: 'JJSC',
		city: 'Taipei',
		area: 'JJ'
	}
}

class NewForm extends Form {}

export default new NewForm({ fields, labels, values }, { name: '$505', options: {fallback: false }});
