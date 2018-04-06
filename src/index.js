import addons from '@storybook/addons';

export const withTests = function withTests(tests, karmaResults) {
    const channel = addons.getChannel();
    const options = {
        tests,
        karmaResults,
    };

    return function (getStory) {
        channel.emit('storybook/karma/add_tests', options);
        return {
            template: `<div><story /></div>`,
        };
    };
}