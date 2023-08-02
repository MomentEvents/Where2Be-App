export const CONSTRAINTS = {
    Event: {
        Title: {
            Max: 70,
            Min: 5,
        },
        Description: {
            Max: 2000,
            Min: 10,
        },
        Location: {
            Max: 50,
            Min: 5
        },
        Interest: {
            Max: 1,
            Min: 1,
        }
    },
    User: {
        DisplayName: {
            Max: 30,
            Min: 3,
        },
        Username: {
            Max: 30,
            Min: 6,
        },
        Password: {
            Max: 30,
            Min: 6
        }
    }
}