const StudentSchema = {
    id: { type: String, required: true },
    createdTimestamp: { type: Number, required: true },
    enabled: { type: Boolean, required: true },
    emailVerified: { type: Boolean, required: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    formacao: [{
      escolaridade: { type: String },
      instituicao: { type: String },
      conclusao: { type: Date },
    }],
    experienciaProfissional: [{
      cargo: { type: String },
      empresa: { type: String },
      dataInicio: { type: Date },
      dataTermino: { type: Date },
      emAndamento: { type: Boolean },
    }],
    empresas: [{
      cnpj: { type: String },
      fantasia: { type: String },
    }],
    requiredActions: [{ type: String }],
    notBefore: { type: Number },
    access: {
      manageGroupMembership: { type: Boolean },
      view: { type: Boolean },
      mapRoles: { type: Boolean },
      impersonate: { type: Boolean },
      manage: { type: Boolean },
    },
  };
  
  module.exports = StudentSchema;