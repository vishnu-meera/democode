The functionality of this dashboard is to Show Azure deployment status in various countries

The code is split three parts
    1) Core (have application quiries/commands)
    2) Infrastructure (Data repository and functionality)
    3) Webapp (two functionalities 1 UI and 2) data parsing from excel)

1) UI
=================
    there are five views for the Dashboard
        1) Dashboard
        2) Country
            3) Datacenters
        4) Datacapturing
        5) Login

    1) Dashboard view consists of
        1)Cards
        2)Map
        3)Table
        4)Panel ==> contains panel cards (1. National, 2. mcio, 3. opportunity , 4. datacenter and 5. Movestatus)
            1)
2) Data Parsing
===============
    Uses datacapturing view