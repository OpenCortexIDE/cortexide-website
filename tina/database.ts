import { createLocalDatabase } from '@tinacms/datalayer'

// Use local database for both development and production
// This works without requiring GitHub tokens or external databases
// Content is managed directly through Git commits
export default createLocalDatabase()
