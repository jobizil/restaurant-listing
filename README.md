# Restaurant Listing App

A platform that lists out locations of Restaurants around for users and also tells what type of restaurant it is (Canteen, Bukka or an Eatery). It also helps in giving directions on how to get there and helps users identify the feel of the environment.

### User Types

- Admin: Website Owners or anybody with authorized access.
- User: public users.

## Restaurant Directory | About Us

This project aims to specialize in providing users a complete and accurate electronic listing of Restaurants located throughout Lagos State and possibly Nigeria.
By utilizing a Smart Search Technology, users searching for Restaurants and Dining locations, will have the ability to search for restaurants by City or State and by other various search methods including proximity.

When users finally find a restaurant that interests them, they can easily get more information of that restaurant like directions on how to get to the location, or read reviews from that restaurant and also have an idea of the average meal cost.

Searches can be fine tuned by the use of Filters and Search to Restaurants all within a specific location, displaying only those search results.

Restaurant owners are provided free business listings.

### FUTURE PLANS

When finally Onboarding, Restaurant owners have the option of enhancing their listing by adding special services available only to Registered Restaurant Owners.

## DATABASE MODELS

### RESTAURANTS

- businessName,
- website,
- email,
- parkingLot,
- address,
- averageRating,
- averageCost,
- restaurantType

### MENU

- menuName,
- description,
- price,
- restaurant

## ROUTES / ENDPOINTS

| Method |         Route          |                  Function |
| :----- | :--------------------: | ------------------------: |
| GET    |      api/v1/auth/      | Index page of the website |
| POST   | api/v1/auth/restaurant |    Creates new restaurant |
| GET    | api/v1/auth/restaurant |   Displays all restaurant |
