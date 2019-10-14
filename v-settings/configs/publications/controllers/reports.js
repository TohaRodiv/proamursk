export default {
    change: {
        event({ event_date_text, place, coordinates, }, { setNewValues, }) {
            if (event_date_text && place && coordinates) {
                const item = {
                    event_date_text,
                    place,
                    coordinates,
                };
                setNewValues(item);
            }
        },
    },
};