export const CONSTRAINTS = {
    Event: {
        Title: {
            Max: 70,
            Min: 3,
        },
        Description: {
            Max: 2000,
            Min: 0,
        },
        Location: {
            Max: 50,
            Min: 0
        },
        Interest: {
            Max: 1,
            Min: 1,
        }
    },
    User: {
        DisplayName: {
            Max: 30,
            Min: 0,
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