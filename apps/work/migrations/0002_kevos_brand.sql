-- KEVOS branding: workspaces still using the original default colour adopt KEVOS orange.
UPDATE workspaces SET color = '#F97316' WHERE lower(color) = '#5b5bd6';
