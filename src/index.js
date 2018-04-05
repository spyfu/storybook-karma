import addons from '@storybook/addons';

// export const withTests = function withTests(tests) {
//     const channel = addons.getChannel();
//     return function (getStory) {
//         return function (context) {
//             channel.emit('storybook/karma/add_tests', tests);
//             return {
//                 data() {
//                     return {
//                         story: getStory(context)
//                     };
//                 },
//                 render(h) { 
//                     return h(this.story)
//                 }
//             };
//         };
//     };
// };

export const withTests = function withTests(tests) {
    const channel = addons.getChannel();

    return function (getStory) {
        channel.emit('storybook/karma/add_tests', tests);
        return {
            template: `<div><story /></div>`,
        };
    };
}