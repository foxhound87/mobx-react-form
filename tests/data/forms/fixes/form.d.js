import { Form } from '../../../../src';

const fields = [
  'itineraryItems[].hotel.name',
  'itineraryItems[].hotel.starRating',
];

class NewForm extends Form {

  onInit(form) {
    form.update({
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

    form.map('itineraryItems', (field) => {
      field.update({
        hotel: {
          name: 'New Test Name',
          starRating: '5.0',
        },
      });
    });
  }
}

export default new NewForm({ fields }, 'Fixes-C');
