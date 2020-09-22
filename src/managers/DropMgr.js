
export const DropStatus = {
   SETUP:     'Setup',
   SCHEDULE:  'Schedule',
   SCHEDULED: 'Scheduled',
   START_COUNTDOWN: 'Start Countdown',
   COUNTDOWN: 'Countdown',
   LIVE:      'Live',
   DROPPED:   'Dropped'
}

export class DropMgr {
   static isActive(drop)         { return DropMgr.isLive(drop) || DropMgr.isDropped(drop) }
   
   static isStatus(drop, status) { return drop.status == status }
   static isSetup(drop)          { return drop.status == DropStatus.SETUP }
   static isSchedule(drop)       { return drop.status == DropStatus.SCHEDULE }		
   static isScheduled(drop)      { return drop.status == DropStatus.SCHEDULED }		
   static isStartCountdown(drop) { return drop.status == DropStatus.START_COUNTDOWN }		
   static isCountdown(drop)      { return drop.status == DropStatus.COUNTDOWN }		
   static isLive(drop)           { return drop.status == DropStatus.LIVE }		
   static isDropped(drop)        { return drop.status == DropStatus.DROPPED }	
}
