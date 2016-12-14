/**
 * Model for a category in the frontend.
 */

class Category extends BaseEntity {
    static getDefaults() {
        return {
            _id: null,
            name: '',
            title: '',
            introduction: '',
            isSeries: false,
            navItem: '',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    }
}