const StudentSchema = {
    id: { type: String, required: true },
    createdTimestamp: { type: Number, required: true },
    enabled: { type: Boolean, required: true },
    emailVerified: { type: Boolean, required: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    graduation: { type: String },
    curriculum: {
        schooling: { type: NodeList } [{
            graduation: { type: String },
            institution: { type: String },
            conclusion: { type: Number },
            }
        ],

        professionalExperience: { type: NodeList } [{
            position: { type: String },
            contractor: { type: String },
            contractTime: { type: String },
            }
        ],
    },
    contractors: { type: NodeList } [{
        taxpayerIdNum: { type: Number },
        name: { type: String }
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