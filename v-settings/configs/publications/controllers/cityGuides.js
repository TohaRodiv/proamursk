export default {
    change: {
        guide_format(guideFormat, { fields, $set, }) {
            const itemsConfig = fields.items;
            const singleRoomPriceConfig = itemsConfig.popup.config[0].blocks[3];
            const luxuryRoomPriceConfig = itemsConfig.popup.config[0].blocks[4];
            const nutritionInfoConfig = itemsConfig.popup.config[0].blocks[5];
            const kitchenConfig = itemsConfig.popup.config[0].blocks[6];
            const avgValueConfig = itemsConfig.popup.config[0].blocks[7];
            const enterPriceConfig = itemsConfig.popup.config[0].blocks[8];
            const workTimeConfig = itemsConfig.popup.config[0].blocks[9];

            if (guideFormat == 'hotel') {
                $set(itemsConfig, 'blocked', false);
                $set(singleRoomPriceConfig, 'show', true);
                $set(luxuryRoomPriceConfig, 'show', true);
                $set(nutritionInfoConfig, 'show', true);
                $set(kitchenConfig, 'show', false);
                $set(avgValueConfig, 'show', false);
                $set(enterPriceConfig, 'show', false);
                $set(workTimeConfig, 'show', false);
                $set(itemsConfig, 'show', true);
            } else if (guideFormat == 'food') {
                $set(itemsConfig, 'blocked', false);
                $set(singleRoomPriceConfig, 'show', false);
                $set(luxuryRoomPriceConfig, 'show', false);
                $set(nutritionInfoConfig, 'show', false);
                $set(kitchenConfig, 'show', true);
                $set(avgValueConfig, 'show', true);
                $set(enterPriceConfig, 'show', true);
                $set(enterPriceConfig.elements[0], 'width', 6);
                $set(workTimeConfig, 'show', true);
                $set(itemsConfig, 'show', true);
            } else if (guideFormat == 'activities') {
                $set(itemsConfig, 'blocked', false);
                $set(singleRoomPriceConfig, 'show', false);
                $set(luxuryRoomPriceConfig, 'show', false);
                $set(nutritionInfoConfig, 'show', false);
                $set(kitchenConfig, 'show', false);
                $set(avgValueConfig, 'show', false);
                $set(enterPriceConfig, 'show', true);
                $set(enterPriceConfig.elements[0], 'width', 4);
                $set(workTimeConfig, 'show', true);
                $set(itemsConfig, 'show', true);
            } else if (guideFormat == 'transport') {
                $set(itemsConfig, 'show', false);
            } else if (guideFormat == 'phone') {
                $set(itemsConfig, 'show', false);
            } else {
                $set(itemsConfig, 'show', false);
            }
        },
    },
};