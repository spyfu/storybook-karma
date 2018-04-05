import addons from '@storybook/addons';

export const withTests(text => {
    const channel = addons.getChannel();
    return getStory => context => {
        channel.emit('storybook/karma/add_tests', text);
    };
});