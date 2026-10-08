--[[
    SCENES
    ------
    A scene has: actors (who + where they start), vehicles, and one "track" per actor
    (the list of things that actor does, in order). All tracks run at the same time.
    Tracks talk to each other with  signal / waitfor.

    Every location is a NAMED MARK (e.g. 'vik_bed'). You create marks in-game with /mark <name>,
    so there are no coordinates in this file.

    STEP TYPES
      wait      { ms }
      cue       { text, ms }                      subtitle for you (director). Does not wait.
      anim      { dict, clip, ms, loop, at, zoff, hoff, freeze, flag }
                  ms   = how long to stay in it (default: length of the clip)
                  at   = play it exactly at a mark (use for beds, chairs); zoff/hoff = height / heading tweak
      scenario  { name, ms, at, sit }             built-in GTA scenarios (coffee, phone, smoking...)
      walk      { to | path = {...}, speed, navmesh }   speed 1.0 = walk, 2.0 = run
      phone     { ms }                            takes out a phone and talks
      turn      { toward = 'actorKey', ms }       turn to face another actor
      place     { at }                            instant teleport to a mark (use as a "cut")
      unfreeze  {}
      say       { line, text }                    ambient voice line (e.g. 'GENERIC_HI')
      enter     { veh, seat }                     seat: -1 driver, 0 front pass., 1 rear left, 2 rear right
      drive     { veh, to, speed, wait }          wait = false -> carry on without waiting to arrive
      vanish    {}                                hide this actor
      signal    { name }                          tell the other tracks "this happened"
      waitfor   { name, delay }                   pause until another track sends that signal
]]

Scenes = {}

----------------------------------------------------------------------------------------------------
-- SCENE: Vikram wakes up, gets ready, steps out, calls for a ride, the driver arrives, he leaves.
--
-- MARKS YOU NEED (stand there and type /mark <name>):
--   vik_bed       stand ON the bed where his body should lie, facing the way his head points
--   vik_bedside   floor next to the bed where he stands up
--   vik_mirror    in front of the mirror / wardrobe, facing it
--   vik_kitchen   at the kitchen counter, facing it
--   vik_door      just inside the front door
--   vik_curb      outside, where he waits for the car
--   car_spawn     sit in a car and park it OFF-CAMERA down the road, then /mark car_spawn
--   car_stop      sit in a car and park it where it should stop for pickup, then /mark car_stop
--   car_exit      sit in a car and park it further down the road (where it drives off to)
----------------------------------------------------------------------------------------------------
Scenes.vikram_morning = {
    label = 'Vikram - wake up, get ready, pickup',
    time = { h = 7, m = 30 },
    weather = 'EXTRASUNNY',

    actors = {
        -- 'vikram' is captured with /cast vikram (his real outfit). model is only a fallback.
        vikram = {
            start = 'vik_bed',
            model = 'a_m_y_business_01',
            pose = { dict = 'timetable@tracy@sleep@', clip = 'idle_c', at = 'vik_bed',
                     zoff = -0.9, loop = true, freeze = true },
        },
        driver = {
            model = 's_m_m_chauffeur_01',
            inVehicle = { veh = 'car', seat = -1 },
        },
    },

    vehicles = {
        car = { model = 'cognoscenti', start = 'car_spawn', plate = 'CELORIS' },
    },

    tracks = {
        vikram = {
            { 'cue',      text = 'PHONE ALARM (add sound in post)', ms = 2500 },
            { 'wait',     ms = 6000 },                                   -- asleep
            { 'unfreeze' },
            { 'place',    at = 'vik_bedside' },                          -- editor cut: now standing by the bed
            { 'anim',     dict = 'mini@triathlon', clip = 'idle_e', ms = 4500 },          -- stretch / yawn (verify)
            { 'walk',     to = 'vik_mirror' },
            { 'anim',     dict = 'clothingtie', clip = 'try_tie_positive_a', ms = 5000 }, -- adjusting collar
            { 'walk',     to = 'vik_kitchen' },
            { 'scenario', name = 'WORLD_HUMAN_AA_COFFEE', ms = 8000 },
            { 'walk',     path = { 'vik_door', 'vik_curb' } },
            { 'cue',      text = 'VIKRAM (phone): "I am outside. Where are you?"', ms = 4000 },
            { 'phone',    ms = 7000 },
            { 'signal',   name = 'called' },
            { 'waitfor',  name = 'car_arrived' },
            { 'turn',     toward = 'driver', ms = 900 },
            { 'enter',    veh = 'car', seat = 2 },
            { 'signal',   name = 'in_car' },
        },

        driver = {
            { 'waitfor',  name = 'called', delay = 2500 },
            { 'drive',    veh = 'car', to = 'car_stop', speed = 11.0 },
            { 'signal',   name = 'car_arrived' },
            { 'waitfor',  name = 'in_car', delay = 1200 },
            { 'drive',    veh = 'car', to = 'car_exit', speed = 14.0, wait = false },
        },
    },
}

-- Copy the block above, rename it, and change the marks / steps to make your next scene.
-- Example ids you will probably want: rooftop_arrival, rooftop_dialogue, kitchen_hub, imax_room ...

----------------------------------------------------------------------------------------------------
-- SCENE: Kabir at the gate, hands raised, arguing in the pouring rain with two men in black suits.
--
-- MARKS YOU NEED (stand there and type /mark <name>):
--   kabir_gate    where Kabir stands at the gate facing outward
--   suit_leader   where the lead suit stands facing Kabir
--   suit_guard    where the second suit stands slightly behind/beside the leader
--   suv_spot      park the black SUV behind the suits with headlights beaming at the gate
----------------------------------------------------------------------------------------------------
Scenes.gate_standoff = {
    label = 'Kabir at the gate - rain standoff with two suits',
    time = { h = 23, m = 15 },
    weather = 'THUNDER',

    actors = {
        kabir = {
            start = 'kabir_gate',
            model = 'mp_m_freemode_01',
            cast = 'kabir',
        },
        suit_leader = {
            start = 'suit_leader',
            model = 's_m_m_security_01',
        },
        suit_guard = {
            start = 'suit_guard',
            model = 's_m_m_highsec_01',
        },
    },

    vehicles = {
        suv = { model = 'granger2', start = 'suv_spot', plate = 'SYNDICATE' },
    },

    tracks = {
        kabir = {
            { 'cue',      text = 'KABIR: "Listen to me! We don\'t answer to Marcus anymore!"', ms = 5000 },
            { 'anim',     dict = 'random@arrests', clip = 'generic_day_loop_idle', ms = 6000 },
            { 'anim',     dict = 'misscarsteal4@actor', clip = 'actor_berating_loop', ms = 7000 },
            { 'anim',     dict = 'random@arrests', clip = 'generic_day_loop_idle', ms = 5000 },
            { 'cue',      text = 'KABIR: "You step one foot through those gates, and the entire cluster purges."', ms = 5000 },
            { 'wait',     ms = 4000 },
        },

        suit_leader = {
            { 'cue',      text = 'AGENT: "You have until sunrise, Mehta. Hand over the drive, or we take the house."', ms = 5000 },
            { 'anim',     dict = 'misscarsteal4@actor', clip = 'actor_talking_loop', ms = 6000 },
            { 'anim',     dict = 'gestures@m@standing@casual', clip = 'gesture_point', ms = 4000 },
            { 'anim',     dict = 'amb@world_human_hang_out_street@female_arms_crossed@idle_a', clip = 'idle_a', ms = 8000 },
        },

        suit_guard = {
            { 'anim',     dict = 'amb@world_human_cop_idles@male@idle_b', clip = 'idle_e', ms = 23000 },
        },
    },
}
