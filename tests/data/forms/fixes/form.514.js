import { Form } from '../../../../src';

const fields = [
  'priority',
  'itineraryItems[].hotel.name',
  'itineraryItems[].hotel.starRating',
];

const input = {
  'priority': p => p === '' ? -1 : Number(p),
  'itineraryItems[].hotel.starRating': rate => {
    return Number(rate)
  }
}

class NewForm extends Form {

  hooks() {
    return {
      onInit(form) {
        form.update({
          priority: '1',
          itineraryItems: [{
            hotel: {
              name: 'Shangri-La Hotel',
              starRating: '5.0',
            },
          }, {
            hotel: null,
          }, {
            hotel: {
              name: 'Trump Hotel',
              starRating: '5.0',
            },
          }],
        });
      },
    };
  }
}

export default new NewForm({ fields, input }, { name: 'Form 514' });
