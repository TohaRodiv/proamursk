export default {
    change: {
        guide_format(data, component) {
            const guideFormat = data.guide_format;
            const itemsConfig = component.FORM_CONFIG.items;
            const singleRoomPriceConfig = itemsConfig.popup_structure[0].blocks[3];
            const luxuryRoomPriceConfig = itemsConfig.popup_structure[0].blocks[4];
            const nutritionInfoConfig = itemsConfig.popup_structure[0].blocks[5];
            const kitchenConfig = itemsConfig.popup_structure[0].blocks[6];
            const avgValueConfig = itemsConfig.popup_structure[0].blocks[7];
            const enterPriceConfig = itemsConfig.popup_structure[0].blocks[8];
            const workTimeConfig = itemsConfig.popup_structure[0].blocks[9];

            if (guideFormat == 'hotel') {
                component.$set(itemsConfig, 'isBlocked', false);
                component.$set(singleRoomPriceConfig, 'show', true);
                component.$set(luxuryRoomPriceConfig, 'show', true);
                component.$set(nutritionInfoConfig, 'show', true);
                component.$set(kitchenConfig, 'show', false);
                component.$set(avgValueConfig, 'show', false);
                component.$set(enterPriceConfig, 'show', false);
                component.$set(workTimeConfig, 'show', false);
                component.$set(itemsConfig, 'show', true);
            } else if (guideFormat == 'food') {
                component.$set(itemsConfig, 'isBlocked', false);
                component.$set(singleRoomPriceConfig, 'show', false);
                component.$set(luxuryRoomPriceConfig, 'show', false);
                component.$set(nutritionInfoConfig, 'show', false);
                component.$set(kitchenConfig, 'show', true);
                component.$set(avgValueConfig, 'show', true);
                component.$set(enterPriceConfig, 'show', true);
                component.$set(enterPriceConfig.elements[0], 'width', 6);
                component.$set(workTimeConfig, 'show', true);
                component.$set(itemsConfig, 'show', true);
            } else if (guideFormat == 'activities') {
                component.$set(itemsConfig, 'isBlocked', false);
                component.$set(singleRoomPriceConfig, 'show', false);
                component.$set(luxuryRoomPriceConfig, 'show', false);
                component.$set(nutritionInfoConfig, 'show', false);
                component.$set(kitchenConfig, 'show', false);
                component.$set(avgValueConfig, 'show', false);
                component.$set(enterPriceConfig, 'show', true);
                component.$set(enterPriceConfig.elements[0], 'width', 4);
                component.$set(workTimeConfig, 'show', true);
                component.$set(itemsConfig, 'show', true);
            } else if (guideFormat == 'transport') {
                component.$set(itemsConfig, 'show', false);
            } else if (guideFormat == 'phone') {
                component.$set(itemsConfig, 'show', false);
            } else {
                component.$set(itemsConfig, 'show', false);
            }
        },
    },
};