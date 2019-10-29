export default {
    change: {
        event(event, { setNewValues, }) {
            if (event) {
                const event_date_text = event.event_date_text;
                const place = event.place;
                const coordinates = event.coordinates;
                if (event_date_text && place && coordinates) {
                    const item = {
                        event_date_text,
                        place,
                        coordinates,
                    };
                    setNewValues(item);
                }
            }
        },
    },
};