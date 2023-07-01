export class StaticKeyboards {
  startKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { 
            text: 'Пополнить баланс⬆️', 
            callback_data: 'sumToUpBalance', 
          },
        ],
        [
          {
            text: 'Приобрести ключ💸', 
            callback_data: 'chooseTariff', 
          },
        ],
        [
          { 
            text: 'Управление ключами🔑',
            callback_data: 'manageKeys', 
          },
        ],
      ],
    },
  };
  
  noKeysKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Приобрести ключ',
            callback_data: 'chooseTariff',
          },
        ],
        [
          {
            text: 'Вернуться назад⬅️', 
            callback_data: 'back', 
          },
        ],
      ],
    },
  };
  
  yesNoKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { 
            text: 'Да, продолжить', 
            callback_data: 'enterEmail',
          },
        ],
        [
          { 
            text: 'Нет, вернуться назад', 
            callback_data: 'back',
          },
        ],
      ],
    },
  };

  enterEmailKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { 
            text: 'Вернуться назад', 
            callback_data: 'tariffManage',
          },
        ],
      ],
    },
  }
}
  