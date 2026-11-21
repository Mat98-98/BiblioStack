export const isUniqueViolation = (error) => error?.code === "23505" || error?.cause?.code === "23505";

export const isForeignKeyViolation = (error) => error?.code === "23503" || error?.cause?.code === "23503";

export const getConstraint = (error) => error?.constraint || error?.cause?.constraint;