-- Datos de ejemplo (opcional; el backend crea la tabla al arrancar).
INSERT INTO tasks (title, due_in_days, important, blocked) VALUES
  ('Pagar proveedor', 1, true, false),
  ('Revisar PR', 5, false, false),
  ('Planear Q3', 30, false, false),
  ('Esperando API externa', 1, true, true);
