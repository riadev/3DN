exports.default = { 
  tasks: function(api){
    return {
      // Should this node run a scheduler to promote delayed tasks?
      scheduler: process.env.SCHEDULE_TASK=="true",
      // what queues should the workers work and how many to spawn?
      //  ['*'] is one worker working the * queue
      //  ['high,low'] is one worker working 2 queues
      queues: ['ros','docker'],
      // how long to sleep between jobs / scheduler checks
      timeout: 5000,
      // What redis server should we connect to for tasks / delayed jobs?
      redis: api.config.redis
    }
  }
}

exports.test = {
  tasks: function(api){
    return {
      scheduler: false,
      timeout: 100,
      queues: [],
      redis: api.config.redis
    }  
  }
}