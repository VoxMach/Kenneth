module.config(function ($routeProvider, $locationProvider) {
    $routeProvider

    .when("/Event/Checklist", {
        templateUrl: "../Event/ChecklistPartial",
        controller: "ChecklistMgmt"
    })

    .when("/Event/Dashboard", {
        templateUrl: "../Event/DashboardPartial",
        controller: "DashboardMgmt"
    })
    .when("/Event/SearchVendor", {
        templateUrl: "../Event/SearchVendorPartial",
        controller:"SearchVendorMgmt"
    })
    .when("/Event/Budget", {
        templateUrl: "../Event/BudgetPartial",
        controller: "BudgetMgmt"
    })

    .when("/Vendor/Dashboard", {
        templateUrl:"../Vendor/VendorDashboardPartial",
        controller: "VendorDashboardMgmt"
    })
    .when("/Message/ChatView", {
        templateUrl:"../Message/ChatViewPartial",
        controller: "MessageMgmt"
    })

    .when("/Vendor/Bookmarks", {
        templateUrl: "../Vendor/BookmarksPartial",
        controller: "BookmarkMgmt"
    })
    
    .when("/Vendor/Calendar",{
        templateUrl:"../Vendor/CalendarPartial",
        controller: "CalendarMgmt"
    })
    
    .when("/Vendor/Book", {
        templateUrl: "../Vendor/BookPartial",
        controller: "BookManagerMgmt"
    })

    .when("/Vendor/Bookings", {
        templateUrl: "../Vendor/BookingsPartial",
        controller: "BookingMgmt"
    })

    
    
    $locationProvider.html5Mode(true);
})